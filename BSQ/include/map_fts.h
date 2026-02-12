/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   map_fts.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 16:00:34 by zintn             #+#    #+#             */
/*   Updated: 2026/02/08 20:48:35 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MAP_FTS_H
# define MAP_FTS_H

char	*line_ctrl(char c, char *str, int *row);
void	line_handle(char *str, int *row);
void	set_1stline_to_map(char *fl);
void	set_othline_to_map(char *str, int row);
void	map_row_init(void);

#endif
