/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putstr_non_printable.c                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/26 16:07:45 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/26 16:10:12 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putstr_non_printable(char *str);
void	ft_putchar(char c);
void	ft_change(unsigned char c);

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	ft_putstr_non_printable(char *str)
{
	unsigned int	i;
	unsigned char	point;

	i = 0;
	while (str[i] != '\0')
	{
		point = (unsigned char)str[i];
		if (str[i] < 32 || str[i] > 126)
		{
			ft_putchar('\\');
			ft_change(point);
		}
		else
		{
			ft_putchar(point);
		}
		i++;
	}
}

void	ft_change(unsigned char c)
{
	unsigned char	a;
	unsigned char	b;

	a = c / 16;
	b = c % 16;
	if (a < 10)
	{
		ft_putchar(a + '0');
	}
	else
	{
		ft_putchar(a + 'a' - 10);
	}
	if (b < 10)
	{
		ft_putchar(b + '0');
	}
	else
	{
		ft_putchar(b + 'a' - 10);
	}
}
