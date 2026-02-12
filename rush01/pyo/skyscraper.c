/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   skyscraper.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 14:28:29 by ihong             #+#    #+#             */
/*   Updated: 2026/02/01 11:34:55 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int		next_permutation(int *arr, int n);
void	swap(int *a, int *b);
void	reverse(int *arr, int start, int last);
int		solve(int row, int **board, int **condition, int board_size);
int		final_check(int row, int **board, int **condition, int board_size);
int		left_check(int **board, int row, int left, int board_size);
int		right_check(int **board, int row, int right, int board_size);
int		top_check(int **board, int col, int top, int board_size);
int		bottom_check(int **board, int col, int bottom, int board_size);
int		dup_check_rows(int **board, int col_limit, int board_size);
int		dup_check_cols(int **board, int row_limit, int board_size);
void	print_board(int **board, int board_size);
int		cal_factorial(int n);
void	init_board_row(int **board, int row, int board_size);
void	init_malloc_board(int ***board_out, int ***condition_out,
			int board_size, char *condition);

int	solve(int row, int **board, int **condition, int board_size)
{
	int	k;
	int	limit;
	int	n;

	if (row == board_size)
	{
		n = -1;
		while (++n < board_size)
			if (!top_check(board, n, condition[0][n], board_size)
				|| !bottom_check(board, n, condition[1][n], board_size))
				return (0);
		print_board(board, board_size);
		return (1);
	}
	k = 0;
	limit = cal_factorial(board_size);
	init_board_row(board, row, board_size);
	while (k < limit)
	{
		next_permutation(board[row], board_size);
		if (final_check(row, board, condition, board_size))
			return (1);
		++k;
	}
	return (0);
}

void	row_value(int *board_row, int board_size)
{
	int	k;

	k = 0;
	while (k < board_size)
	{
		board_row[k] = board_size - k;
		k++;
	}
}

int	final_check(int row, int **board, int **condition, int board_size)
{
	if (left_check(board, row, condition[2][row], board_size)
		&& right_check(board, row, condition[3][row], board_size)
		&& dup_check_cols(board, row, board_size))
	{
		if (solve(row + 1, board, condition, board_size))
			return (1);
	}
	return (0);
}

void	init_malloc_board(int ***board_out, int ***condition_out,
		int board_size, char *condition)
{
	int	n;
	int	k;
	int	**temp_board;
	int	**temp_condition;

	temp_board = malloc(sizeof(int *) * board_size);
	temp_condition = malloc(sizeof(int *) * board_size);
	n = 0;
	while (n < board_size)
	{
		temp_board[n] = malloc(sizeof(int) * board_size);
		temp_condition[n] = malloc(sizeof(int) * board_size);
		++n;
	}
	n = 0;
	while (n < board_size)
	{
		k = -1;
		while (++k < board_size)
			temp_condition[n][k] = condition[2 * (k + n * board_size)] - '0';
		++n;
	}
	*board_out = temp_board;
	*condition_out = temp_condition;
}

void	init_board_row(int **board, int row, int board_size)
{
	int	n;

	n = 0;
	while (n < board_size)
	{
		board[row][n] = board_size - n;
		++n;
	}
}
