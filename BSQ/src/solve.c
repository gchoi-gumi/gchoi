/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   solve.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 14:24:58 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/08 20:51:44 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

int	get_min(int a, int b, int c)
{
	int	min;

	min = a;
	if (b < min)
		min = b;
	if (c < min)
		min = c;
	return (min);
}

void	solve_bsq(t_map_info *map)
{
	int		**dp;
	t_res	res;
	int		col;

	res.max = 0;
	res.r = 0;
	res.c = 0;
	col = ft_strlen(map->map[0]);
	if (!map->map || !map->map[0])
		return ;
	if (!map_check(map->map, map, col))
	{
		g_is_error = 1;
		return ;
	}
	dp = map_dp(map->row, col);
	if (!dp)
		return ;
	init_dp(map, dp, col);
	process(map, dp, &res, col);
	print_board(map, &res, col);
	free_dp(dp, map->row);
}

void	process(t_map_info *map, int **dp, t_res *res, int col)
{
	int	i;
	int	j;

	i = -1;
	while (++i < map->row)
	{
		j = -1;
		while (++j < col)
		{
			if (dp[i][j] > 0)
			{
				if (i > 0 && j > 0)
				{
					if (is_expand(dp, i, j, dp[i - 1][j - 1]))
						dp[i][j] = dp[i - 1][j - 1] + 1;
					else
						dp[i][j] = get_min(dp[i - 1][j], dp[i][j - 1], dp[i
								- 1][j - 1]) + 1;
				}
				update_res(res, dp[i][j], i, j);
			}
		}
	}
}

int	is_expand(int **dp, int i, int j, int condition)
{
	if (dp[i - 1][j] >= condition && dp[i][j - 1] >= condition && dp[i - 1][j
		- 1] >= condition)
		return (1);
	return (0);
}

void	free_dp(int **dp, int row)
{
	int	i;

	i = 0;
	while (i < row)
	{
		if (dp[i])
		{
			free(dp[i]);
			dp[i] = NULL;
		}
		i++;
	}
	free(dp);
}
