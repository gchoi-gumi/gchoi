/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr_base.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/27 17:01:08 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/30 11:14:02 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putnbr_base(int nbr, char *base);
void	change(long long n, char *base, int base_len);

void	ft_putnbr_base(int nbr, char *base)
{
	int			base_len;
	long long	n;
	int			i;

	i = 0;
	base_len = 0;
	n = nbr;
	while (base[i] != '\0')
	{
		i++;
		base_len++;
	}
	if (base_len >= 2)
		change(n, base, base_len);
}

void	change(long long n, char *base, int base_len)
{

	if (n < 0)
	{
		write(1, "-", 1);
		n = -n;
	}
	if (n >= base_len)
	{
		change(n / base_len, base, base_len);
	}
	write(1, &base[n % base_len], 1);
}