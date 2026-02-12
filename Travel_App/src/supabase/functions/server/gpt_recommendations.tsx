// GPT 기반 날씨 반영 추천 시스템
export async function getGPTRecommendations(preferences: any, location: string, weather: any) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // 날씨에 따른 추천 전략 결정
  const isGoodWeather = weather?.temperature > 10 && 
    !weather?.description?.includes('비') && 
    !weather?.description?.includes('눈') &&
    !weather?.description?.includes('rain') &&
    !weather?.description?.includes('snow');
  
  const weatherContext = isGoodWeather 
    ? `현재 날씨가 좋습니다 (${weather?.temperature}°C, ${weather?.description}). 야외 활동이 적합합니다.`
    : `현재 날씨가 좋지 않습니다 (${weather?.temperature}°C, ${weather?.description}). 실내 활동을 우선 추천해주세요.`;

  // GPT 프롬프트 생성
  const prompt = `당신은 한국 여행 전문가입니다. 다음 정보를 바탕으로 ${location}에서의 맞춤형 여행지를 추천해주세요.

여행 선호도:
- 여행 스타일: ${preferences.travelStyle}
- 동행인: ${preferences.companion}
- 예산: ${preferences.budget}
- 선호 활동: ${preferences.activities.join(', ')}

날씨 정보:
${weatherContext}

요구사항:
1. 날씨에 적합한 장소를 추천해주세요 (날씨가 나쁘면 실내 위주, 좋으면 실외 위주)
2. 정확한 장소 이름과 간단한 설명을 제공해주세요
3. 각 장소는 실제 존재하는 유명한 관광지여야 합니다
4. **정확히 5개의 장소만 추천해주세요**
5. **첫 4개는 여행지(관광명소/맛집/카페/문화시설/자연)를 추천하고, 5번째는 반드시 숙소(호텔/게스트하우스/펜션/리조트 등)를 추천해주세요**
6. 5번째 숙소의 category는 반드시 "숙소"로 설정해주세요
7. JSON 형식으로만 응답해주세요

응답 형식:
{
  "summary": "추천 요약 (2-3문장)",
  "recommendations": [
    {
      "title": "장소 이름",
      "description": "장소 설명 (2-3문장)",
      "category": "카테고리 (1-4번째: 관광명소/맛집/카페/문화시설/자연 중 하나, 5번째: 숙소)",
      "address": "대략적인 주소나 위치",
      "isIndoor": true 또는 false,
      "tags": ["태그1", "태그2", "태그3"],
      "estimatedCost": "예상 비용 (무료/저렴/보통/비쌈)",
      "recommendedDuration": "권장 소요시간 (예: 1-2시간)"
    }
  ]
}

예시:
recommendations 배열은 정확히 5개의 항목을 포함해야 합니다.
- recommendations[0-3]: 여행지
- recommendations[4]: 숙소 (category: "숙소")`;

  // OpenAI API 호출
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '당신은 한국 여행 전문가이며, 날씨와 사용자 선호도를 고려하여 최적의 여행지를 추천합니다. 항상 JSON 형식으로만 응답합니다.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!openaiResponse.ok) {
    const error = await openaiResponse.text();
    console.error('[GPT Recommend] OpenAI API error:', error);
    throw new Error('Failed to get recommendations from GPT');
  }

  const openaiData = await openaiResponse.json();
  const gptResponse = openaiData.choices[0].message.content;
  
  console.log('[GPT Recommend] Raw GPT response:', gptResponse);

  // JSON 파싱
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(gptResponse);
  } catch (parseError) {
    console.error('[GPT Recommend] JSON parse error:', parseError);
    // JSON 추출 시도
    const jsonMatch = gptResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse GPT response');
    }
  }

  // Google Places API로 사진과 정확한 정보 보완
  const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
  const recommendationsWithPhotos = [];

  if (googleApiKey && parsedResponse.recommendations) {
    for (const rec of parsedResponse.recommendations) {
      try {
        // 장소 검색
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
          `input=${encodeURIComponent(rec.title + ' ' + location)}&` +
          `inputtype=textquery&` +
          `fields=place_id,name,formatted_address,photos,rating&` +
          `language=ko&` +
          `key=${googleApiKey}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        let photoUrl = null;
        if (searchData.candidates && searchData.candidates[0]?.photos) {
          const photoReference = searchData.candidates[0].photos[0].photo_reference;
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?` +
            `maxwidth=800&` +
            `photo_reference=${photoReference}&` +
            `key=${googleApiKey}`;
        }

        recommendationsWithPhotos.push({
          ...rec,
          gptCategory: rec.category,
          googlePhoto: photoUrl,
          googlePlaceId: searchData.candidates?.[0]?.place_id,
          address: searchData.candidates?.[0]?.formatted_address || rec.address,
        });
      } catch (error) {
        console.error(`[GPT Recommend] Error fetching photo for ${rec.title}:`, error);
        recommendationsWithPhotos.push({
          ...rec,
          gptCategory: rec.category,
          googlePhoto: null,
        });
      }
    }
  } else {
    // Google API 없으면 그대로 사용
    recommendationsWithPhotos.push(...parsedResponse.recommendations.map((rec: any) => ({
      ...rec,
      gptCategory: rec.category,
      googlePhoto: null,
    })));
  }

  return {
    summary: parsedResponse.summary,
    recommendations: recommendationsWithPhotos,
    weatherBased: isGoodWeather ? 'outdoor' : 'indoor',
  };
}
