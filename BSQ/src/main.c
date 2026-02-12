/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 22:51:47 by jiheo             #+#    #+#             */
/*   Updated: 2026/02/08 21:40:51 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

t_map_info	*g_map_info;
int			g_is_error;

void		process_start(int fd);

int	main(int argc, char *argv[])
{
	int		i;
	int		fd;

	if (argc > 1)
	{
		i = 1;
		while (i < argc)
		{
			fd = open(argv[i], O_RDONLY);
			if (fd >= 0)
			{
				process_start(fd);
				close(fd);
			}
			if (i != argc - 1)
				ft_putchar('\n');
			i++;
		}
	}
	else
	{
		process_start(0);
	}
	return (SUCCESS);
}

void	process_start(int fd)
{
	map_init();
	set_map(fd);
	if (!g_is_error && g_map_info && g_map_info->map)
	{
		solve_bsq(g_map_info);
	}
	else
		write(STD_ERR, ERROR_MSG, sizeof(ERROR_MSG) - 1);
	map_free();
}
