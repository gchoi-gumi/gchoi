/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strjoin.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/03 18:08:20 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/05 17:14:04 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

char	*ft_strjoin(int size, char **strs, char *sep);
int		str_len(char *str);
char	*join(int size, char **strs, char *sep, char *strjoin);

char	*ft_strjoin(int size, char **strs, char *sep)
{
	int		i;
	int		total_len;
	char	*strjoin;

	if (size == 0)
	{
		strjoin = malloc(1);
		strjoin[0] = '\0';
		return (strjoin);
	}
	total_len = 0;
	i = 0;
	while (i < size)
	{
		total_len += str_len(strs[i]);
		if (i < size - 1)
			total_len += str_len(sep);
		i++;
	}
	strjoin = (char *)malloc(sizeof(char) * (total_len + 1));
	if (!strjoin)
		return (NULL);
	return (join(size, strs, sep, strjoin));
}

int	str_len(char *str)
{
	int	i;

	i = 0;
	while (str[i] != '\0')
		i++;
	return (i);
}

char	*join(int size, char **strs, char *sep, char *strjoin)
{
	int	i;
	int	j;
	int	k;

	i = 0;
	k = 0;
	while (i < size)
	{
		j = 0;
		while (strs[i][j] != '\0')
			strjoin[k++] = strs[i][j++];
		j = 0;
		if (i < size - 1)
			while (sep[j] != '\0')
				strjoin[k++] = sep[j++];
		i++;
	}
	strjoin[k] = '\0';
	return (strjoin);
}
