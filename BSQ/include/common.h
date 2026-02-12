/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   common.h                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 16:00:34 by zintn             #+#    #+#             */
/*   Updated: 2026/02/08 21:40:21 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef COMMON_H
# define COMMON_H

# include <fcntl.h>
# include <stdlib.h>
# include <unistd.h>

# define STD_IN 0
# define STD_OUT 1
# define STD_ERR 2
# define BUF_MAX 8192
# define SUCCESS 0
# define FAIL 1
# define ERROR_MSG "map error\n"

typedef struct s_map_info
{
	int				row;
	char			empty;
	char			obstacle;
	char			full;
	char			**map;
}					t_map_info;

extern t_map_info	*g_map_info;
extern int			g_is_error;

#endif
