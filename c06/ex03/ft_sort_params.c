/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_params.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/02 23:45:32 by gchoi             #+#    #+#             */
/*   Updated: 2026/02/03 01:01:35 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putchar(char c);
int		ft_strcmp(char *s1, char *s2);
void	print_garams(int agc, char **agv);

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

int	ft_strcmp(char *s1, char *s2)
{
	int	k;

	k = 0;
	while (s1[k] != '\0' && s2[k] != '\0' && s1[k] == s2[k])
		k++;
	return (s1[k] - s2[k]);
}

void	print_garams(int agc, char **agv)
{
	int	i;
	int	j;

	i = 1;
	while (i < agc)
	{
		j = 0;
		while (agv[i][j])
			ft_putchar(agv[i][j++]);
		ft_putchar('\n');
		i++;
	}
}

int	main(int agc, char **agv)
{
	int		i;
	int		j;
	char	*temp;

	if (agc < 2)
		return (0);
	i = 0;
	while (i < agc - 1)
	{
		j = 1;
		while (j < agc - 1 - i)
		{
			if (ft_strcmp(agv[j], agv[j + 1]) > 0)
			{
				temp = agv[j];
				agv[j] = agv[j + 1];
				agv[j + 1] = temp;
			}
			j++;
		}
		i++;
	}
	print_garams(agc, agv);
	return (0);
}
