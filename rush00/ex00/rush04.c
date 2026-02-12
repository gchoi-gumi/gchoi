/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rush04.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hyelee <hyelee@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/25 17:01:26 by hyelee            #+#    #+#             */
/*   Updated: 2026/01/25 17:23:53 by hyelee           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	rush(int x, int y);
void	ft_putchar(char c);
void	put_ok(int x, int y, int i, int j);

void	rush(int x, int y)
{
	int	i;
	int	j;

	i = 1;
	j = 1;
	if (x <= 0 || y <= 0)
	{
		write(1, "WARNING: Invalid Input.\nPlease enter a natural number.", 53);
		return ;
	}
	while (i <= y)
	{
		while (j <= x)
		{
			put_ok(x, y, i, j);
			j++;
		}
		write(1, "\n", 1);
		j = 1;
		i++;
	}
}

void	put_ok(int x, int y, int i, int j)
{
	if (((i == 1 && j == 1) || (i == y && j == x)) && y != 1 )
	{
		if (i != 1 && x == 1)
			ft_putchar('C');
		else
			ft_putchar('A');
	}
	else if ((i == y && j == 1) || (i == 1 && j == x))
	{
		if (i == 1 && j == 1)
			ft_putchar('A');
		else
			ft_putchar('C');
	}
	else if ((i == 1) || (j == 1) || (i == y) || (j == x))
	{
		ft_putchar('B');
	}
	else
	{
		ft_putchar(' ');
	}
}
