/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/04 15:16:31 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/09 22:54:09 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int		check_charset(char c, char *charset);
char	**ft_split(char *str, char *charset);
int		count_words(char *str, char *charset);
int		word_len(char *str, char *charset);
char	**split_malloc(char **split, char *str, char *charset);

char	**ft_split(char *str, char *charset)
{
	char	**split;
	int		words;

	words = count_words(str, charset);
	split = (char **)malloc(sizeof(char *) * (words + 1));
	if (!split)
		return (NULL);
	split_malloc(split, str, charset);
	return (split);
}

int	check_charset(char c, char *charset)
{
	while (*charset != '\0')
	{
		if (c == *charset)
			return (1);
		charset++;
	}
	return (0);
}

int	count_words(char *str, char *charset)
{
	int	count;

	count = 0;
	while (*str)
	{
		if (check_charset(*str, charset) == 0)
		{
			count++;
			while (*str != '\0' && check_charset(*str, charset) == 0)
				str++;
		}
		else
			str++;
	}
	return (count);
}

int	word_len(char *str, char *charset)
{
	int	len;

	len = 0;
	while (str[len] != '\0' && check_charset(str[len], charset) == 0)
		len++;
	return (len);
}

char	**split_malloc(char **split, char *str, char *charset)
{
	int	i;
	int	j;
	int	len;

	i = 0;
	while (*str)
	{
		if (check_charset(*str, charset) == 0)
		{
			len = word_len(str, charset);
			split[i] = (char *)malloc(sizeof(char) * (len + 1));
			if (!split[i])
				return (NULL);
			j = 0;
			while (j < len)
				split[i][j++] = *str++;
			split[i][j] = '\0';
			i++;
		}
		else
			str++;
	}
	split[i] = NULL;
	return (split);
}
