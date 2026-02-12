/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main_header.h                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 14:53:50 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/11 15:28:13 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MAIN_HEADER_H
# define MAIN_HEADER_H

# include <unistd.h>

int		add(int i, int j);
int		sub(int i, int j);
int		mul(int i, int j);
int		div(int i, int j);
int		mod(int i, int j);
int		index_check(char *sep);
int		ft_atoi(char *str);
void	ft_putnbr(int nb);
void	ft_putnbr_recursive(long long n);

#endif