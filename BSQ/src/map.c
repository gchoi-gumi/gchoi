/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   map.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 17:15:52 by zintn             #+#    #+#             */
/*   Updated: 2026/02/08 21:33:28 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

void	set_map(int fd)
{
	char	c;
	char	*str;
	int		row;

	str = (char *)malloc(sizeof(char));
	if (!str)
		return ;
	*str = '\0';
	row = 0;
	while (read(fd, &c, sizeof(char)))
	{
		if (c != '\n' && (!is_printable(c) || (row && !is_map_char(c))))
			g_is_error = 1;
		str = line_ctrl(c, str, &row);
	}
	if (row <= g_map_info->row)
		g_is_error = 1;
	free(str);
	close(fd);
}

void	map_init(void)
{
	g_map_info = (t_map_info *)malloc(sizeof(t_map_info));
	if (!g_map_info)
		return ;
	g_map_info->row = 0;
	g_map_info->empty = '\0';
	g_map_info->obstacle = '\0';
	g_map_info->full = '\0';
	g_map_info->map = NULL;
	g_is_error = 0;
}

void	map_free(void)
{
	int	i;

	if (!g_map_info)
		return ;
	i = 0;
	while (g_map_info->map && i < g_map_info->row)
	{
		if (g_map_info->map[i])
			free(g_map_info->map[i]);
		i++;
	}
	free(g_map_info->map);
	free(g_map_info);
}
