/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print_board.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 20:51:23 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/08 20:11:52 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

void	init_dp(t_map_info *map, int **dp, int col)
{
	int	i;
	int	j;

	i = 0;
	while (i < map->row)
	{
		j = 0;
		while (j < col)
		{
			if (map->map[i][j] == map->obstacle)
				dp[i][j] = 0;
			else
				dp[i][j] = 1;
			j++;
		}
		i++;
	}
}

void	print_board(t_map_info *map, t_res *res, int col)
{
	int	i;
	int	j;

	i = 0;
	while (i < map->row)
	{
		j = 0;
		while (j < col)
		{
			if (i > res->r - res->max && i <= res->r && j > res->c - res->max
				&& j <= res->c)
			{
				ft_putchar(map->full);
			}
			else
				ft_putchar(map->map[i][j]);
			j++;
		}
		ft_putchar('\n');
		i++;
	}
}

int	**map_dp(int rows, int cols)
{
	int	**dp;
	int	i;

	dp = (int **)malloc(sizeof(int *) * rows);
	if (!dp)
		return (NULL);
	i = 0;
	while (i < rows)
	{
		dp[i] = (int *)malloc(sizeof(int) * (cols + 1));
		if (!dp[i])
			return (NULL);
		i++;
	}
	return (dp);
}

void	update_res(t_res *res, int val, int r, int c)
{
	if (val > res->max)
	{
		res->max = val;
		res->r = r;
		res->c = c;
	}
}
