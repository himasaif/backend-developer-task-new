import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Query,  
} from '@nestjs/common';
import { MembersService, PaginatedMembersResult } from './members.service'; 
import { CreateMemberDTO } from './dto/create-member.dto';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { MemberDTO } from './dto/member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDTO): Promise<MemberDTO> {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',       
    @Query('limit') limit = '20',    
  ): Promise<PaginatedMembersResult> {
    return this.membersService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  
}