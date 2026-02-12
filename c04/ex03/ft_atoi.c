/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/26 22:59:05 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/05 01:36:30 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>

int	ft_atoi(char *str);

int	ft_atoi(char *str)
{
	int	i;
	int	count;
	int	a;

	a = 0;
	i = 0;
	count = 0;
	while ((str[i] >= 9 && str[i] <= 13) || str[i] == 32)
		i++;
	while (str[i] == '-' || str[i] == '+')
	{
		if (str[i] == '-')
			count++;
		i++;
	}
	while (str[i] >= '0' && str[i] <= '9')
	{
		a = (a * 10) + (str[i] - '0');
		i++;
	}
	if (count % 2 == 1)
		a = -a;
	return (a);
}

int	main(void)
{
	// 테스트할 문자열 배열
	char *test_cases[] = {
		"12345",          // 일반 양수
		"   -12345",      // 공백 + 음수
		" ---+--12345",   // 여러 개의 부호 (홀수 개 '-' -> 음수)
		" \t\n\r\v\f 42", // 다양한 화이트스페이스
		" +-42abc123",    // 숫자 뒤에 문자가 오는 경우
		"0",              // 0
		"  --2147483647", // int 최대값 근처 (양수)
		NULL              // 종료 플래그
	};

	printf("--- ft_atoi 테스트 시작 ---\n");

	for (int i = 0; test_cases[i] != NULL; i++)
	{
		int result = ft_atoi(test_cases[i]);
		printf("입력값: [%s] \t=> 결과값: %d\n", test_cases[i], result);
	}

	return (0);
}