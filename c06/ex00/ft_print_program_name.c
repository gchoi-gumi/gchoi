/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_program_name.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/02 14:04:13 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/02 16:50:36 by gchoi            ###   ########.fr       */
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

	(void)agc;
	i = 0;
	while (agv[0][i] != '\0')
	{
		ft_putchar(agv[0][i]);
		i++;
	}
	ft_putchar('\n');
	return (0);
}
