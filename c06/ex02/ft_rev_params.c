/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_rev_params.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/02 23:40:16 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/02 23:44:51 by gchoi            ###   ########.fr       */
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

	i = agc - 1;
	j = 0;
	while (i > 0)
	{
		j = 0;
		while (agv[i][j] != '\0')
		{
			ft_putchar(agv[i][j]);
			j++;
		}
		ft_putchar('\n');
		i--;
	}
	return (0);
}
