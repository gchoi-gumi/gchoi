/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   view_check.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 15:38:20 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/31 16:33:59 by ihong            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int	left_check(int board[4][4], int row, int left);
int	right_check(int board[4][4], int row, int right);
int	top_check(int board[4][4], int col, int top);
int	bottom_check(int board[4][4], int col, int bottom);

int	left_check(int board[4][4], int row, int left)
{
	int	i;
	int	count;
	int	max;

	i = 0;
	count = 0;
	max = 0;
	while (i < 4)
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

int	right_check(int board[4][4], int row, int right)
{
	int	i;
	int	count;
	int	max;

	i = 3;
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

int	top_check(int board[4][4], int col, int top)
{
	int	i;
	int	count;
	int	max;

	i = 0;
	count = 0;
	max = 0;
	while (i < 4)
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

int	bottom_check(int board[4][4], int col, int bottom)
{
	int	i;
	int	count;
	int	max;

	i = 3;
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
