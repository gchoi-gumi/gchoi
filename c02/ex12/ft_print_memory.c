/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_memory.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/25 00:09:06 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/26 18:12:21 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <unistd.h>

void	*ft_print_memory(void *addr, unsigned int size);
void	ft_change(unsigned char c);
void	ft_putchar(char c);
void	ft_address_print(unsigned long addr);
void	hex(unsigned char *c, unsigned long size, unsigned int i);

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	*ft_print_memory(void *addr, unsigned int size)
{
	unsigned int	i;
	unsigned int	j;
	unsigned char	*point;

	if (size == 0)
		return (addr);
	point = (unsigned char *)addr;
	i = 0;
	while (i < size)
	{
		ft_address_print((unsigned long)(point + i));
		hex(point, size, i);
		j = 0;
		while (j < 16 && (i + j) < size)
		{
			if (point[i + j] < 32 || point[i + j] > 126)
				ft_putchar('.');
			else
				ft_putchar(point[i + j]);
			j++;
		}
		ft_putchar('\n');
		i = i + 16;
	}
	return (addr);
}

void	ft_address_print(unsigned long addr)
{
	char	add[16];
	int		i;
	int		temp;

	i = 15;
	while (i >= 0)
	{
		temp = addr % 16;
		if (temp < 10)
		{
			add[i] = temp + '0';
		}
		else
		{
			add[i] = temp + 'a' - 10;
		}
		addr /= 16;
		i--;
	}
	write(1, add, 16);
	write(1, ": ", 2);
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

void	hex(unsigned char *c, unsigned long size, unsigned int i)
{
	unsigned int	j;

	j = 0;
	while (j < 16)
	{
		if (i + j < size)
		{
			ft_change(c[i + j]);
		}
		else
		{
			write(1, "  ", 2);
		}
		if (j % 2 == 1)
		{
			write(1, " ", 1);
		}
		j++;
	}
}

int	main(void)
{
	char			str[150];
	char			*src;
	unsigned int	i;

	src = "Bonjour les aminches\t\n\tc\a est fou\ttout\tce qu on peut faire avec\t\n\tprint_memory\n\n\n\tlol.lol\n ";
	i = 0;
	while (src[i] != '\0' && i < 149)
	{
		str[i] = src[i];
		i++;
	}
	str[i] = '\0';
	ft_print_memory(str, i + 1);
	return (0);
}