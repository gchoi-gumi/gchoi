/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 21:47:21 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/08 18:52:38 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

int	first_line_check(t_map_info *map)
{
	if (map->empty == map->obstacle || \
		map->empty == map->full || \
		map->obstacle == map->full)
		return (0);
	return (1);
}

int	map_check(char **map_out, t_map_info *map, int col)
{
	int	i;
	int	j;

	i = 0;
	while (i < map->row)
	{
		j = 0;
		while (j < col && map_out[i][j] != '0')
		{
			if (map_out[i][j] != map->empty && map_out[i][j] != map->obstacle)
				return (0);
			j++;
		}
		if (j != col)
			return (0);
		i++;
	}
	return (1);
}
