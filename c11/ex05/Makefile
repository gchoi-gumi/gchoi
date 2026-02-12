# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gchoi <gchoi@student.42gyeongsan.kr>       +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/02/11 14:57:24 by gchoi             #+#    #+#              #
#    Updated: 2026/02/11 15:01:47 by gchoi            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME	= do-op
CC      = cc
CFLAGS  = -Wall -Wextra -Werror
SRCS	= calculation.c doop.c ft_atoi.c ft_putnbr.c
OBJS	= $(SRCS:.c=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) -o $(NAME) $(OBJS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re