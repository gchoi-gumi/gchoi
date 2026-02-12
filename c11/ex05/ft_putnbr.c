/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 14:52:54 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/11 15:26:24 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "main_header.h"

void	ft_putnbr(int nb)
{
	long long	n;

	n = nb;
	if (n < 0)
	{
		write(1, "-", 1);
		n = -n;
	}
	ft_putnbr_recursive(n);
}

void	ft_putnbr_recursive(long long n)
{
	char	c;

	if (n >= 10)
		ft_putnbr_recursive(n / 10);
	c = (n % 10) + '0';
	write(1, &c, 1);
}
