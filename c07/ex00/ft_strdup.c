/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strdup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/03 16:27:35 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/07 23:23:07 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <unistd.h>

char	*ft_strdup(char *src);
int		str_len(char *src);

char	*ft_strdup(char *src)
{
	char	*di;
	int		str;
	int		i;

	i = 0;
	str = str_len(src);
	di = (char *)malloc(sizeof(char) * str + 1);
	if (!di)
		return (NULL);
	while (src[i] != '\0')
	{
		di[i] = src[i];
		i++;
	}
	di[i] = '\0';
	return (di);
}

int	str_len(char *src)
{
	int	i;

	i = 0;
	while (src[i] != '\0')
		i++;
	return (i);
}
