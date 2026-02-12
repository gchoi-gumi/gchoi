/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 14:27:03 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/11 15:26:17 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "main_header.h"

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
