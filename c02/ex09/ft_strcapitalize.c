/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strcapitalize.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 21:30:09 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/29 16:08:23 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

char	*ft_strcapitalize(char *str);
int		check(char str);

char	*ft_strcapitalize(char *str)
{
	char	*start;
	int		i;

	i = 0;
	start = str;
	while (str[i] != '\0')
	{
		if (str[i] >= 'A' && str[i] <= 'Z')
		{
			str[i] = str[i] + 32;
		}
		if (i == 0 || check(str[i - 1]) == 1)
		{
			if (str[i] >= 'a' && str[i] <= 'z')
			{
				str[i] = str[i] - 32;
			}
		}
		i++;
	}
	return (start);
}

int	check(char str)
{
	if ((str >= 'a' && str <= 'z') || (str >= 'A' && str <= 'Z') || (str >= '0'
			&& str <= '9'))
	{
		return (0);
	}
	else
	{
		return (1);
	}
}
