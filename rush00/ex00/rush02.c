/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rush02.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hyelee <hyelee@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 16:57:30 by hyunlee           #+#    #+#             */
/*   Updated: 2026/01/25 17:10:12 by hyelee           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	put_ok(int i, int j, int x, int y);
void	ft_putchar(char c);
void	rush(int x, int y);

void	put_ok(int row, int col, int x, int y)
{
	int	is_row_line;
	int	is_col_line;
	int	is_line;

	is_line = (row == 1 || col == 1 || row == x || col == y);
	is_row_line = (row == 1 || row == x);
	is_col_line = (col == 1 || col == y);
	if (is_col_line && is_row_line)
	{
		if (col == 1)
			ft_putchar('A');
		else
			ft_putchar('C');
	}
	else if (is_line)
		ft_putchar('B');
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
