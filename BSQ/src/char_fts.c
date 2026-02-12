/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   char_fts.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jiheo <jiheo@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/07 21:06:20 by jiheo             #+#    #+#             */
/*   Updated: 2026/02/08 18:44:58 by jiheo            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/main_header.h"

void	ft_putchar(char c)
{
	write(STD_OUT, &c, sizeof(char));
}

int	is_printable(char c)
{
	if (32 <= c && c <= 126)
		return (1);
	return (0);
}

int	is_numeric(char c)
{
	if ('0' <= c && c <= '9')
		return (1);
	return (0);
}

int	is_map_char(char c)
{
	if (g_map_info->empty == c || \
		g_map_info->obstacle == c || \
		g_map_info->full == c)
		return (1);
	return (0);
}
