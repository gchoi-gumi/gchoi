/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_range.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/03 16:55:47 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/07 23:21:57 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <unistd.h>

int	*ft_range(int min, int max);

int	*ft_range(int min, int max)
{
	int	*nbr;
	int	i;

	i = 0;
	nbr = (int *)malloc(sizeof(int) * (max - min));
	if (min >= max || !nbr)
		return (0);
	while (i < max - min)
	{
		nbr[i] = min + i;
		i++;
	}
	return (nbr);
}
