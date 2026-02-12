/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 14:54:51 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/31 16:09:40 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

int	check_row(int board[4][4], int row, int col);
int	check_col(int board[4][4], int row, int col);

int	check_row(int board[4][4], int row, int col)
{
	int	check[5];
	int	col_var;
	int	val;

	col_var = 0;
	while (col_var < 5)
		check[col_var++] = 0;
	col_var = 0;
	while (col_var < col)
	{
		val = board[row][col_var];
		if (val < 1 || val > 4)
			return (0);
		if (check[val] == 1)
			return (0);
		check[val] = 1;
		col_var++;
	}
	return (1);
}

int	check_col(int board[4][4], int row, int col)
{
	int	check[5];
	int	row_var;
	int	val;

	row_var = 0;
	while (row_var < 5)
		check[row_var++] = 0;
	row_var = 0;
	while (row_var < row)
	{
		val = board[row_var][col];
		if (val < 1 || val > 4)
			return (0);
		if (check[val] == 1)
			return (0);
		check[val] = 1;
		row_var++;
	}
	return (1);
}
