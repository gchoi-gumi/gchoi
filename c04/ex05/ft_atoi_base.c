/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi_base.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/27 21:46:34 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/30 11:13:13 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

int	ft_atoi(char *str, int base_len);
int	ft_atoi_base(char *str, char *base);
int	over_chagne(char *str, int base_len);
int	low_chagne(char *str, int base_len);
int	over_put(char str);

int	low_change(char *str, int base_len)
{
	int	i;
	int	count;
	int	a;

	a = 0;
	i = 0;
	count = 0;
	while ((str[i] >= 9 && str[i] <= 13) || str[i] == 32)
		i++;
	while (str[i] == '-' || str[i] == '+')
	{
		if (str[i] == '-')
			count++;
		i++;
	}
	while (str[i] >= '0' && str[i] < base_len + '0')
	{
		a = (a * base_len) + (str[i] - '0');
		i++;
	}
	if (count % 2 == 1)
		a = -a;
	return (a);
}

int	over_change(char *str, int base_len)
{
	int	i;
	int	count;
	int	a;

	a = 0;
	i = 0;
	count = 0;
	while ((str[i] >= 9 && str[i] <= 13) || str[i] == 32)
		i++;
	while (str[i] == '-' || str[i] == '+')
	{
		if (str[i] == '-')
			count++;
		i++;
	}
	while ((str[i] >= '0' && str[i] <= '9') || (str[i] >= 'a' && str[i] < 'a'
			+ base_len - 10) || (str[i] >= 'A' && str[i] < 'A' + base_len - 10))
	{
		a = (a * base_len) + over_put(str[i]);
		i++;
	}
	if (count % 2 == 1)
		a = -a;
	return (a);
}

int	over_put(char str)
{
	int	a;

	a = 0;
	if (str >= '0' && str <= '9')
		a = (str - '0');
	else if (str >= 'a' && str <= 'f')
		a = (str - 'a' + 10);
	else if (str >= 'A' && str <= 'F')
		a = (str - 'A' + 10);
	return (a);
}

int	ft_atoi(char *str, int base_len)
{
	if (base_len <= 10)
		return (low_change(str, base_len));
	else
		return (over_change(str, base_len));
}

int	ft_atoi_base(char *str, char *base)
{
	int base_len;
	int i;

	i = 0;
	base_len = 0;
	if (base[i] == '\0' || str[i] == '\0')
		return (0);
	while (base[base_len] != '\0')
		base_len++;
	if (base_len < 2)
		return (0);
	return (ft_atoi(str, base_len));
}