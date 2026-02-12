/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   doop.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 13:59:32 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/12 14:36:12 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "main_header.h"

int	main(int argc, char **argv)
{
	int	(*ops[5])(int, int);
	int	idx;
	int	val1;
	int	val2;

	if (argc != 4)
		return (0);
	ops[0] = add;
	ops[1] = sub;
	ops[2] = mul;
	ops[3] = div;
	ops[4] = mod;
	idx = index_check(argv[2]);
	val1 = ft_atoi(argv[1]);
	val2 = ft_atoi(argv[3]);
	if (idx == 3 && val2 == 0)
		write(1, "Stop : division by zero", 23);
	else if (idx == 4 && val2 == 0)
		write(1, "Stop : modulo by zero", 21);
	else if (idx != -1)
		ft_putnbr(ops[idx](val1, val2));
	write(1, "\n", 1);
	return (0);
}

int	index_check(char *sep)
{
	char	op;
	int		index;

	op = sep[0];
	index = -1;
	if (sep[1] == '\0')
	{
		if (op == '+')
			index = 0;
		else if (op == '-')
			index = 1;
		else if (op == '*')
			index = 2;
		else if (op == '/')
			index = 3;
		else if (op == '%')
			index = 4;
	}
	if (index == -1)
		write(1, "0", 1);
	return (index);
}
