/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_ten_queens_puzzle.c                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/01 18:06:34 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/02 13:50:03 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

int		ft_ten_queens_puzzle(void);
int		check(int board[10][10], int col, int row);
int		solve(int board[10][10], int col);
void	print_board(int board[10][10]);

int	ft_ten_queens_puzzle(void)
{
	int	board[10][10];
	int	i;
	int	j;

	i = 0;
	while (i < 10)
	{
		j = 0;
		while (j < 10)
		{
			board[i][j] = 0;
			j++;
		}
		i++;
	}
	return (solve(board, 0));
}

int	solve(int board[10][10], int col)
{
	int	row;
	int	count;

	if (col == 10)
	{
		print_board(board);
		return (1);
	}
	row = 0;
	count = 0;
	while (row < 10)
	{
		if (check(board, col, row))
		{
			board[row][col] = 1;
			count = count + solve(board, col + 1);
		}
		board[row][col] = 0;
		row++;
	}
	return (count);
}

int	check(int board[10][10], int col, int row)
{
	int	i;
	int	n;

	i = 0;
	while (i < col)
	{
		if (board[row][i] == 1)
			return (0);
		n = 0;
		while (n < col)
		{
			if (row - (col - n) >= 0)
				if (board[row - (col - n)][n] == 1)
					return (0);
			if (row + (col - n) < 10)
				if (board[row + (col - n)][n] == 1)
					return (0);
			n++;
		}
		i++;
	}
	return (1);
}

void	print_board(int board[10][10])
{
	int		col;
	int		row;
	char	c;

	col = 0;
	while (col < 10)
	{
		row = 0;
		while (row < 10)
		{
			if (board[row][col] == 1)
			{
				c = row + '0';
				write(1, &c, 1);
			}
			row++;
		}
		col++;
	}
	write(1, "\n", 1);
}
