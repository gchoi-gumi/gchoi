/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rush01.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hyelee <hyelee@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 16:57:30 by hyunlee           #+#    #+#             */
/*   Updated: 2026/01/25 16:57:01 by hyelee           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	put_ok(int i, int j, int x, int y);
void	ft_putchar(char c);
void	rush(int x, int y);

void	put_ok(int row, int col, int x, int y)
{
	int	is_line;
	int	ul;
	int	ur;
	int	dl;
	int	dr;

	is_line = (row == 1 || col == 1 || row == x || col == y);
	ul = (row == 1 && col == 1);
	ur = (row == x && col == 1);
	dl = (row == 1 && col == y);
	dr = (row == x && col == y);
	if (ul)
		ft_putchar('/');
	else if (ur || dl)
		ft_putchar('\\');
	else if (dr)
		ft_putchar('/');
	else if (is_line)
		ft_putchar('*');
	else
		ft_putchar(' ');
}

void	rush(int x, int y)
{
	int	row;
	int	col;

	row = 1;
	col = 1;
	if (x <= 0 || y <= 0)
	{
		write(1, "WARNING: Invalid Input.\nPlease enter a natural number.", 53);
		return ;
	}
	while (col <= y)
	{
		while (row <= x)
		{
			put_ok(row, col, x, y);
			row++;
		}
		ft_putchar('\n');
		col++;
		row = 1;
	}
}
