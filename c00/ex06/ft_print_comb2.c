/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_comb2.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/21 16:22:33 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/28 01:16:19 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_print_comb2(void)
{
	int		a;
	int		b;
	char	out[5];

	a = 0;
	while (a <= 98)
	{
		b = a + 1;
		while (b <= 99)
		{
			out[0] = (a / 10) + '0';
			out[1] = (a % 10) + '0';
			out[2] = ' ';
			out[3] = (b / 10) + '0';
			out[4] = (b % 10) + '0';
			write(1, out, 5);
			if (!(a == 98 && b == 99))
				write(1, ", ", 2);
			b++;
		}
		a++;
	}
}

int main(void)
{
	ft_print_comb2();
	return 0;
}