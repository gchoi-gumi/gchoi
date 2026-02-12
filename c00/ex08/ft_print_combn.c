/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_combn.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/21 20:48:13 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/22 17:41:04 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_print_combi(int n, int start, int last, char *length)
{
	int	i;

	if (last == n)
	{
		write(1, length, n);
		if (length[0] < (10 - n + '0'))
		{
			write(1, ", ", 2);
		}
		return ;
	}
	i = start;
	while (i <= 9)
	{
		length[last] = i + '0';
		ft_print_combi(n, i + 1, last + 1, length);
		i++;
	}
}

void	ft_print_combn(int n)
{
	char	length[10];

	if (n > 0 && n < 10)
	{
		ft_print_combi(n, 0, 0, length);
	}
}
