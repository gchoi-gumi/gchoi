/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   source.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/31 11:45:50 by gchoi             #+#    #+#             */
/*   Updated: 2026/01/31 16:07:27 by gchoi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        write(1, "Error\n", 6);
        return (1);
    }

    int nums[16];
    int i = 0;
    int k = 0;
    char *str = argv[1];

    while (str[i] != '\0' && k < 16) {
        if (str[i] >= '0' && str[i] <= '4') {
            nums[k] = str[i] - '0';
            k++;
        }
        i++;
    }
}

/*int input_check(int* input) 
{
    int i;
    int dir;
    int j;

    dir = 0;
    i = 0;
    while(input[i] = '\0')
    {
        int top = input[i];          
        int bottom = input[i + 4]; 
        int left = input[i + 8]; 
        int right = input[i + 12];

        if (top + bottom < 3 || top + bottom > 5)
            return 1;
        if ((top == 4 && bottom != 1) || (bottom == 4 && top != 1))
            return 1;

        if (left + right < 3 || left + right > 5)
            return 1;
        if ((left == 4 && right != 1) || (right == 4 && left != 1)) 
            return 1;
        i++;
    }
    
    while(dir < 16)
    {
        int count4 = 0;
        int count1 = 0;
        while(j < 4)
        {
            if (input[dir + i] == 4) 
                count4++;
            if (input[dir + i] == 1)
                count1++;
            j++;
        }
        if (count4 > 1 || count1 > 3) 
            return 1;
        dir = dir + 4;
    }
    return 0;
}
*/
