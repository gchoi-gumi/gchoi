/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   view_check.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 15:38:20 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/31 22:09:49 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int	left_check(int **board, int row, int left, int board_size);
int	right_check(int **board, int row, int right, int board_size);
int	top_check(int **board, int col, int top, int board_size);
int	bottom_check(int **board, int col, int bottom, int board_size);

int	left_check(int **board, int row, int left, int board_size)
{
	int	i;
	int	count;
	int	max;

	i = 0;
	count = 0;
	max = 0;
	while (i < board_size)
	{
		if (board[row][i] > max)
		{
			max = board[row][i];
			count++;
		}
		i++;
	}
	if (left == count)
		return (1);
	else
		return (0);
}

int	right_check(int **board, int row, int right, int board_size)
{
	int	i;
	int	count;
	int	max;

	i = board_size - 1;
	count = 0;
	max = 0;
	while (i >= 0)
	{
		if (board[row][i] > max)
		{
			max = board[row][i];
			count++;
		}
		i--;
	}
	if (right == count)
		return (1);
	else
		return (0);
}

int	top_check(int **board, int col, int top, int board_size)
{
	int	i;
	int	count;
	int	max;

	i = 0;
	count = 0;
	max = 0;
	while (i < board_size)
	{
		if (board[i][col] > max)
		{
			count++;
			max = board[i][col];
		}
		i++;
	}
	if (top == count)
		return (1);
	else
		return (0);
}

int	bottom_check(int **board, int col, int bottom, int board_size)
{
	int	i;
	int	count;
	int	max;

	i = board_size - 1;
	count = 0;
	max = 0;
	while (i >= 0)
	{
		if (board[i][col] > max)
		{
			count++;
			max = board[i][col];
		}
		i--;
	}
	if (bottom == count)
		return (1);
	else
		return (0);
}
