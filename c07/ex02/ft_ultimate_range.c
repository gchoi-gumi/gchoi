/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_ultimate_range.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/03 17:15:42 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/05 17:14:01 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <unistd.h>

int	ft_ultimate_range(int **range, int min, int max);

int	ft_ultimate_range(int **range, int min, int max)
{
	int	*nbr;
	int	i;

	i = 0;
	nbr = (int *)malloc(sizeof(int) * (max - min));
	if (min >= max)
		return (0);
	if (!nbr)
		return (-1);
	while (i < max - min)
	{
		nbr[i] = min + i;
		i++;
	}
	*range = nbr;
	return (i);
}
