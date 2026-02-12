/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main_header.h                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/08 14:16:19 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/08 20:03:30 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MAIN_HEADER_H
# define MAIN_HEADER_H

# include "common.h"
# include "map.h"
# include "map_fts.h"
# include "str_fts.h"
# include "char_fts.h"
# include <stdio.h>

typedef struct s_res
{
	int	max;
	int	r;
	int	c;
}		t_res;

// solve.c 함수
int		get_min(int a, int b, int c);
void	solve_bsq(t_map_info *map);
void	process(t_map_info *map, int **dp, t_res *res, int col);
int		is_expand(int **dp, int i, int j, int condition);
void	free_dp(int **dp, int row);

// print_board.c 함수
void	init_dp(t_map_info *map, int **dp, int col);
void	print_board(t_map_info *map, t_res *res, int col);
int		**map_dp(int rows, int cols);
void	update_res(t_res *res, int val, int r, int c);

// check.c 함수
int		first_line_check(t_map_info *map);
int		map_check(char **map_out, t_map_info *map, int col);

#endif
