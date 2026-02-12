/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_convert_base2.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/04 15:12:02 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/05 17:14:09 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int	base_from_check(char *base_from, int base_from_len);
int	base_to_check(char *base_to, int base_to_len);
int	malloc_len(int nbr, int base_to_len);

int	base_from_check(char *base_from, int base_from_len)
{
	int	i;
	int	j;

	if (base_from_len < 2)
		return (0);
	i = 0;
	while (base_from[i])
	{
		if (base_from[i] == '+' || base_from[i] == '-' || base_from[i] <= 32
			|| base_from[i] > 126)
			return (0);
		j = i + 1;
		while (base_from[j])
		{
			if (base_from[i] == base_from[j])
				return (0);
			j++;
		}
		i++;
	}
	return (1);
}

int	base_to_check(char *base_to, int base_to_len)
{
	int	i;
	int	j;

	if (base_to_len < 2)
		return (0);
	i = 0;
	while (base_to[i])
	{
		if (base_to[i] == '+' || base_to[i] == '-' || base_to[i] <= 32
			|| base_to[i] > 126)
			return (0);
		j = i + 1;
		while (base_to[j])
		{
			if (base_to[i] == base_to[j])
				return (0);
			j++;
		}
		i++;
	}
	return (1);
}

int	malloc_len(int nbr, int base_to_len)
{
	int			i;
	long long	n;

	n = nbr;
	i = 0;
	if (n <= 0)
	{
		i++;
		n = -n;
	}
	while (n > 0)
	{
		n = n / base_to_len;
		i++;
	}
	return (i);
}
