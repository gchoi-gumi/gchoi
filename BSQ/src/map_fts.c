/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   map_fts.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 17:15:52 by zintn             #+#    #+#             */
/*   Updated: 2026/02/09 21:35:26 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

char	*line_ctrl(char c, char *str, int *row)
{
	char	*new_str;

	if (c != '\n')
	{
		new_str = add_char_in_str(c, str);
		free(str);
		return (new_str);
	}
	line_handle(str, row);
	free(str);
	new_str = (char *)malloc(sizeof(char) * 1);
	if (new_str)
		new_str[0] = '\0';
	return (new_str);
}

void	line_handle(char *str, int *row)
{
	if (*row == 0)
	{
		set_1stline_to_map(str);
		if (!first_line_check(g_map_info))
			g_is_error = 1;
	}
	else if (1 <= *row && *row <= g_map_info->row)
	{
		if (2 <= *row && \
			ft_strlen(str) != ft_strlen(g_map_info->map[*row - 2]))
			g_is_error = 1;
		set_othline_to_map(str, *row);
	}
	else
		g_is_error = 1;
	*row = *row + 1;
}

void	set_1stline_to_map(char *fl)
{
	int	len;
	int	i;

	len = ft_strlen(fl);
	if (len >= 4)
	{
		i = 0;
		while (is_numeric(fl[i]) && i < len - 3)
		{
			g_map_info->row = g_map_info->row * 10 + (fl[i++] - '0');
		}
		if (g_map_info->row <= 0)
			g_is_error = 1;
		else
		{
			g_map_info->empty = fl[len - 3];
			g_map_info->obstacle = fl[len - 2];
			g_map_info->full = fl[len - 1];
			g_map_info->map = (char **)malloc(sizeof(char *) * g_map_info->row);
			map_row_init();
		}
	}
	else
		g_is_error = 1;
}

void	set_othline_to_map(char *str, int row)
{
	int	i;
	int	len;

	len = ft_strlen(str);
	g_map_info->map[row - 1] = (char *)malloc(sizeof(char) * (len + 1));
	if (g_map_info->map[row - 1])
	{
		i = 0;
		while (*(str + i))
		{
			g_map_info->map[row - 1][i] = *(str + i);
			i++;
		}
		g_map_info->map[row - 1][i] = '\0';
	}
}

void	map_row_init(void)
{
	int	i;

	i = 0;
	while (i < g_map_info->row)
		g_map_info->map[i++] = NULL;
}
