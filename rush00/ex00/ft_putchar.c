/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putchar.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hyunlee <hyunlee@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/23 20:45:35 by hyunlee           #+#    #+#             */
/*   Updated: 2026/01/24 13:24:08 by hyunlee          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	put_ok(int i, int j, int x, int y);
void	ft_putchar(char c);
void	rush(int x, int y);

void	ft_putchar(char c)
{
	write(1, &c, 1);
}
