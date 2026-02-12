/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 14:54:51 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/01 14:22:28 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

int	dup_check_rows(int **board, int col_limit, int board_size);
int	dup_check_cols(int **board, int row_limit, int board_size);
int	dup_check_row(int **board, int row, int col, int board_size);
int	dup_check_col(int **board, int row, int col, int board_size);

int	dup_check_row(int **board, int row, int col, int board_size)
{
	int	check[10];
	int	col_var;
	int	val;

	col_var = 0;
	while (col_var < 10)
		check[col_var++] = 0;
	col_var = 0;
	while (col_var < col + 1)
	{
		val = board[row][col_var];
		if (val < 1 || val > board_size)
			return (0);
		if (check[val] == 1)
			return (0);
		check[val] = 1;
		col_var++;
	}
	return (1);
}

int	dup_check_col(int **board, int row, int col, int board_size)
{
	int	check[10];
	int	row_var;
	int	val;

	row_var = 0;
	while (row_var < 10)
		check[row_var++] = 0;
	row_var = 0;
	while (row_var < row + 1)
	{
		val = board[row_var][col];
		if (val < 1 || val > board_size)
			return (0);
		if (check[val] == 1)
			return (0);
		check[val] = 1;
		row_var++;
	}
	return (1);
}

int	dup_check_rows(int **board, int col_limit, int board_size)
{
	int	n;
	int	flag;

	flag = 1;
	n = 0;
	while (n < board_size)
	{
		if (dup_check_row(board, n, col_limit, board_size) == 0)
		{
			flag = 0;
			break ;
		}
		++n;
	}
	return (flag);
}

int	dup_check_cols(int **board, int row_limit, int board_size)
{
	int	n;
	int	flag;

	flag = 1;
	n = 0;
	while (n < board_size)
	{
		if (dup_check_col(board, row_limit, n, board_size) == 0)
		{
			flag = 0;
			break ;
		}
		++n;
	}
	return (flag);
}
