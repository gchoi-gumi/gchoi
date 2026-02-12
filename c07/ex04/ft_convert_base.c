/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_convert_base.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/03 22:16:58 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/05 17:14:06 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int		ft_atoi(char *str, char *base_from, int base_len);
char	*ft_convert_base(char *nbr, char *base_from, char *base_to);
char	*change_base(int nbr, char *base_to, int base_len);
int		base_from_check(char *base_from, int base_from_len);
int		base_to_check(char *base_to, int base_to_len);
int		malloc_len(int nbr, int base_to_len);
void	reverse(char *str);

char	*ft_convert_base(char *nbr, char *base_from, char *base_to)
{
	int		i;
	int		j;
	int		n;
	char	*print;

	i = 0;
	j = 0;
	while (base_from[i] != '\0')
		i++;
	while (base_to[j] != '\0')
		j++;
	if (nbr == NULL || base_from == NULL || base_to == NULL)
		return (NULL);
	if (base_from_check(base_from, i) == 0 || base_to_check(base_to, j) == 0)
		return (NULL);
	n = ft_atoi(nbr, base_from, i);
	print = change_base(n, base_to, j);
	reverse(print);
	return (print);
}

int	ft_atoi(char *str, char *base_from, int base_len)
{
	int	count;
	int	a;
	int	j;

	a = 0;
	count = 1;
	while ((*str >= 9 && *str <= 13) || *str == 32)
		str++;
	while (*str == '-' || *str == '+')
	{
		if (*str == '-')
			count = count * (-1);
		str++;
	}
	while (*str != '\0')
	{
		j = 0;
		while (base_from[j] != '\0' && *str != base_from[j])
			j++;
		if (base_from[j] == '\0')
			break ;
		a = (a * base_len) + j;
		str++;
	}
	return (a * count);
}

char	*change_base(int nbr, char *base_to, int base_len)
{
	char		*base;
	int			i;
	long long	n;

	i = 0;
	n = nbr;
	base = (char *)malloc(sizeof(char) * (malloc_len(nbr, base_len) + 1));
	if (!base)
		return (NULL);
	if (n < 0)
		n = -n;
	if (n == 0)
		base[i++] = base_to[0];
	while (n > 0)
	{
		base[i] = base_to[n % base_len];
		n = n / base_len;
		i++;
	}
	if (nbr < 0)
		base[i++] = '-';
	base[i] = '\0';
	return (base);
}

void	reverse(char *str)
{
	int		i;
	int		len;
	char	temp;

	i = 0;
	len = 0;
	while (str[len])
		len++;
	while (i < len / 2)
	{
		temp = str[i];
		str[i] = str[len - 1 - i];
		str[len - 1 - i] = temp;
		i++;
	}
}
