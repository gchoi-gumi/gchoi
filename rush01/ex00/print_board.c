/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_board.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 21:13:02 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/01 21:55:26 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <unistd.h>

int		next_permutation(int *arr, int n);
void	swap(int *a, int *b);
void	reverse(int *arr, int start, int last);
void	print_board(int **board, int board_size);
int		cal_factorial(int n);

void	print_board(int **board, int board_size)
{
	int		i;
	int		k;
	char	c;

	i = 0;
	while (i < board_size)
	{
		k = 0;
		while (k < board_size)
		{
			c = board[i][k] + '0';
			write(1, &c, 1);
			if (k < board_size - 1)
				write(1, " ", 1);
			++k;
		}
		write(1, "\n", 1);
		++i;
	}
}

void	swap(int *a, int *b)
{
	int	temp;

	temp = *a;
	*a = *b;
	*b = temp;
}

void	reverse(int *arr, int start, int end)
{
	while (start < end)
	{
		swap(&arr[start], &arr[end]);
		start++;
		end--;
	}
}

int	next_permutation(int *arr, int n)
{
	int	i;
	int	j;

	if (n <= 1)
		return (0);
	i = n - 2;
	while (i >= 0 && arr[i] >= arr[i + 1])
		i--;
	if (i < 0)
	{
		reverse(arr, 0, n - 1);
		return (0);
	}
	j = n - 1;
	while (arr[j] <= arr[i])
		j--;
	swap(&arr[i], &arr[j]);
	reverse(arr, i + 1, n - 1);
	return (1);
}

int	cal_factorial(int n)
{
	if (n < 0)
		return (0);
	if (n == 0 || n == 1)
		return (1);
	else
		return (n * cal_factorial(n - 1));
}
