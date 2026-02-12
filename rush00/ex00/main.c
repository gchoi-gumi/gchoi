/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hyelee <hyelee@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/23 20:04:33 by hyunlee           #+#    #+#             */
/*   Updated: 2026/01/25 17:25:02 by hyelee           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

void	put_ok(int i, int j, int x, int y);
void	ft_putchar(char c);
void	rush(int x, int y);

int	main(void)
{
	rush('A', 0);
	rush(1 << 31, 5);
	rush(5, 5);
	rush(1, 5);
	rush(5, 1);
	rush(1, 1);
	rush(2, 2);
	return (0);
}
