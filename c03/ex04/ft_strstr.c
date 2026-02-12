/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strstr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/26 13:30:32 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/26 15:50:17 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

char	*ft_strstr(char *str, char *to_find);
int		str_len(char *str);

int	str_len(char *str)
{
	int	i;

	i = 0;
	while (str[i] != '\0')
		i++;
	return (i);
}

char	*ft_strstr(char *str, char *to_find)
{
	int	i;
	int	j;
	int	tmp;

	i = 0;
	if (to_find[0] == '\0')
		return (str);
	while (str[i] != '\0')
	{
		j = 0;
		tmp = 0;
		if (str[i] == to_find[j])
		{
			while (to_find[j] != '\0' && str[i + j] != '\0')
			{
				if (to_find[j] == str[i + j])
					tmp++;
				j++;
			}
		}
		if (tmp == str_len(to_find))
			return (&str[i]);
		i++;
	}
	return (0);
}
