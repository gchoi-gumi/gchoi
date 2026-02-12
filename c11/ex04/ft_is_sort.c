/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_is_sort.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 13:51:18 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/11 15:29:44 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int	ft_is_sort(int *tab, int length, int (*f)(int, int));

int	ft_is_sort(int *tab, int length, int (*f)(int, int))
{
	int	i;
	int	order;
	int	cmp;

	if (length <= 1)
		return (1);
	i = 0;
	order = 0;
	while (i < length - 1)
	{
		cmp = f(tab[i], tab[i + 1]);
		if (cmp != 0)
		{
			if (order == 0)
				order = cmp;
			else
			{
				if ((order > 0 && cmp < 0) || (order < 0 && cmp > 0))
					return (0);
			}
		}
		i++;
	}
	return (1);
}
