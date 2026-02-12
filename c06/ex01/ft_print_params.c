/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_params.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/02 14:47:33 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/02 23:39:04 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

int	main(int agc, char **agv)
{
	int	i;
	int	j;

	i = 1;
	j = 0;
	while (i < agc)
	{
		j = 0;
		while (agv[i][j] != '\0')
		{
			ft_putchar(agv[i][j]);
			j++;
		}
		ft_putchar('\n');
		i++;
	}
	return (0);
}
