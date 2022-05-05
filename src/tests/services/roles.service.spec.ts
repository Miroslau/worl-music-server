import {RolesService} from "../../services/roles.service";
import {Test, TestingModule} from "@nestjs/testing";
import {getModelToken} from "@nestjs/sequelize";
import {Role} from "../../model/roles.model";
import {Model} from "sequelize-typescript";
import {stubRole, stubRoles} from "../stubs/role.stub";


describe('RolesService', () => {
    let service: RolesService;
    let roleRepository: Model<Role>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesService,
                {
                    provide: getModelToken(Role),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(stubRole()),
                        findAll: jest.fn().mockResolvedValue(stubRoles()),
                        create: jest.fn().mockResolvedValue(stubRole())
                    }
                }
            ],
        }).compile();

        service = module.get<RolesService>(RolesService);
        roleRepository = module.get<Model<Role>>(getModelToken(Role));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('getByValue', () => {
        it('then it should return a role', () => {
            // @ts-ignore
            const repoSpy = jest.spyOn(roleRepository, 'findOne');
            expect(service.getByValue(stubRole().value)).resolves.toEqual(
                stubRole(),
            );
            expect(repoSpy).toBeCalledWith({where: {value: stubRole().value}});
        })
    })

    describe('getAll', () => {
        it ('then it should return all roles',  () => {
            // @ts-ignore
            const repoSpy = jest.spyOn(roleRepository, 'findAll');
            expect(service.getAll()).resolves.toEqual(
                stubRoles(),
            )
            expect(repoSpy).toHaveBeenCalled();
        })
    })
})
