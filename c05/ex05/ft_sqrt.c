/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sqrt.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/01 16:14:05 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/01 17:03:03 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <unistd.h>

int	ft_sqrt(int nb);
int	sqrt_val(int n, int nb);

int	ft_sqrt(int nb)
{
	int	n;

	n = 1;
	if (nb <= 0)
		return (0);
	else
		return (sqrt_val(n, nb));
}

int	sqrt_val(int n, int nb)
{
	if (nb == n * n)
		return (n);
	if (nb < n * n)
		return (0);
	if (nb > n * n)
		return (sqrt_val(n + 1, nb));
	return (0);
}
