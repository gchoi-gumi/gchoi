/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/01 11:08:39 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/07 21:26:13 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int		solve(int row, int **board, int **condition, int board_size);
void	free_all(int **board, int **condition, int board_size);
int		argv_string_check(char **argv, int board_size);
void	init_malloc_board(int ***board_out, int ***condition_out,
			int board_size, char *condition);

int	main(int argc, char **argv)
{
	int	result;
	int	**board;
	int	**condition;
	int	board_size;

	if (argc != 3)
	{
		write(1,
			"You have to pass like \". \\/program <grid_num> <condition>\"",
			59);
		return (-1);
	}
	board_size = argv[1][0] - '0';
	if (!(argv_string_check(argv, board_size)))
	{
		write(1, "You entered an invalid string.\n", 31);
		return (-1);
	}
	init_malloc_board(&board, &condition, board_size, argv[2]);
	result = solve(0, board, condition, board_size);
	if (result == 0)
		write(1, "Error\n", 6);
	free_all(board, condition, board_size);
	return (0);
}

void	free_all(int **board, int **condition, int board_size)
{
	int	i;

	i = 0;
	while (i < board_size)
	{
		free(board[i]);
		free(condition[i]);
		i++;
	}
	free(board);
	free(condition);
}

int	argv_string_check(char **argv, int board_size)
{
	int	i;
	int	j;
	int	total_len;

	i = 2;
	j = 0;
	total_len = (board_size * 4) * 2 - 1;
	while (j < total_len)
	{
		if (argv[i][j] == '\0')
			return (0);
		if (j % 2 == 0)
			if (!(argv[i][j] > '0' && argv[i][j] <= board_size + '0'))
				return (0);
		if (j % 2 == 1)
			if (!(argv[i][j] == ' '))
				return (0);
		j++;
	}
	if (argv[i][j] != '\0')
		return (0);
	return (1);
}
