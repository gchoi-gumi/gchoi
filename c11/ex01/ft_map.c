/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_map.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 13:35:08 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/12 16:39:46 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

int	*ft_map(int *tab, int length, int (*f)(int));

int	*ft_map(int *tab, int length, int (*f)(int))
{
	int	*new_array;
	int	i;

	new_array = (int *)malloc(sizeof(int) * length);
	if (new_array == 0)
		return (0);
	i = 0;
	while (i < length)
	{
		new_array[i] = f(tab[i]);
		i++;
	}
	return (new_array);
}
